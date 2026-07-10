import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';

export interface CardSwapHandle {
  /** Bring a specific card index to the front immediately via GSAP */
  swapTo: (targetIndex: number) => void;
  /** Advance one card forward (same as auto-swap) */
  swapNext: () => void;
  /** Bring the previous card to the front */
  swapPrev: () => void;
}

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  /** Called whenever a new card reaches the front position */
  onFrontChange?: (frontIndex: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onFrontChange,
  skewAmount = 6,
  easing = 'elastic',
  children
}, ref) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const onFrontChangeRef = useRef(onFrontChange);
  onFrontChangeRef.current = onFrontChange;

  // Core swap function — moves current front card to back
  const swapRef = useRef<() => void>(() => {});

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        // Notify parent which card is now in front (index in childArr, not order slot)
        onFrontChangeRef.current?.(order.current[0]);
      });
    };

    swapRef.current = swap;

    swap();
    onFrontChangeRef.current?.(order.current[0]);
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  // ── Imperative API ─────────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    swapNext() {
      // Kill ongoing timeline, do one swap immediately, reset interval
      tlRef.current?.kill();
      clearInterval(intervalRef.current);
      swapRef.current();
      intervalRef.current = window.setInterval(swapRef.current, delay);
    },

    swapPrev() {
      // Rotate order so the last card becomes first, then "swap next" brings it forward
      if (order.current.length < 2) return;
      tlRef.current?.kill();
      clearInterval(intervalRef.current);

      // Immediately snap all cards to positions matching the reversed order
      const total = refs.length;
      const last = order.current[order.current.length - 1];
      order.current = [last, ...order.current.slice(0, -1)];
      refs.forEach((r, i) => {
        const slot = makeSlot(order.current.indexOf(i), cardDistance, verticalDistance, total);
        placeNow(r.current!, slot, skewAmount);
      });
      onFrontChangeRef.current?.(order.current[0]);

      intervalRef.current = window.setInterval(swapRef.current, delay);
    },

    swapTo(targetIndex: number) {
      if (!order.current.includes(targetIndex)) return;
      // Rotate order array until targetIndex is at front, snap everything
      tlRef.current?.kill();
      clearInterval(intervalRef.current);

      const total = refs.length;
      while (order.current[0] !== targetIndex) {
        const [front, ...rest] = order.current;
        order.current = [...rest, front];
      }
      refs.forEach((r, i) => {
        const pos = order.current.indexOf(i);
        const slot = makeSlot(pos, cardDistance, verticalDistance, total);
        placeNow(r.current!, slot, skewAmount);
      });
      onFrontChangeRef.current?.(order.current[0]);

      intervalRef.current = window.setInterval(swapRef.current, delay);
    },
  }), [cardDistance, verticalDistance, delay, skewAmount]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-auto lg:left-auto lg:bottom-0 lg:right-0 transform lg:translate-x-[5%] lg:translate-y-[20%] origin-center lg:origin-bottom-right perspective-[900px] overflow-visible scale-[0.65] sm:scale-[0.80] lg:scale-100"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
});

CardSwap.displayName = 'CardSwap';

export default CardSwap;