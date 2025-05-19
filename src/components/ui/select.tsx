import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  // Create a ref for the wrapper div
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Store the wrapper's position in a data attribute when the trigger is clicked
  const handleClick = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty('--select-trigger-top', `${rect.top}px`);
      document.documentElement.style.setProperty('--select-trigger-left', `${rect.left}px`);
      document.documentElement.style.setProperty('--select-trigger-width', `${rect.width}px`);
      document.documentElement.style.setProperty('--select-trigger-height', `${rect.height}px`);
    }
  };

  return (
    <div ref={wrapperRef} className="select-wrapper relative w-full">
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 select-trigger",
          className
        )}
        // Add touch handling to prevent page shift on mobile
        onTouchStart={(e) => {
          // Prevent default touch behavior that might cause page shift
          e.stopPropagation();
        }}
        onClick={handleClick}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </div>
  );
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  // Detect if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false);

  // Ref for the content element
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Combine refs
  const handleRef = (el: HTMLDivElement) => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(el);
      } else {
        ref.current = el;
      }
    }
    contentRef.current = el;
  };

  // Check if we're on mobile
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Initial check
      checkMobile();

      // Listen for resize events
      window.addEventListener('resize', checkMobile);

      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  // Position the dropdown directly below the trigger on mobile
  React.useEffect(() => {
    if (typeof window !== 'undefined' && isMobile) {
      const positionDropdown = () => {
        // Find the content wrapper
        const contentWrapper = document.querySelector('[data-radix-popper-content-wrapper]');
        if (!contentWrapper) return;

        // Add our custom class
        contentWrapper.classList.add('select-content-wrapper');

        // Find the active trigger element
        const triggerElement = document.querySelector('.select-trigger[data-state="open"]');
        if (!triggerElement) return;

        // Get the trigger's position directly from the element
        const triggerRect = triggerElement.getBoundingClientRect();

        // We need to measure the content height after it's rendered
        // First, position it off-screen but visible to get its height
        (contentWrapper as HTMLElement).style.position = 'absolute';
        (contentWrapper as HTMLElement).style.top = '-9999px';
        (contentWrapper as HTMLElement).style.left = '0';
        (contentWrapper as HTMLElement).style.visibility = 'hidden';

        // Use a default height initially
        let contentHeight = 200;

        // Use setTimeout to measure after the browser has rendered
        setTimeout(() => {
          // Now measure the actual height
          contentHeight = contentWrapper.getBoundingClientRect().height || contentHeight;

          // Calculate the position directly above the trigger
          const top = (triggerRect.top + window.scrollY) - contentHeight - 5; // 5px offset

          // Now position it properly and make it visible
          (contentWrapper as HTMLElement).style.top = `${top}px`;
          (contentWrapper as HTMLElement).style.left = `${triggerRect.left}px`;
          (contentWrapper as HTMLElement).style.visibility = 'visible';

          // Store the content height in a CSS variable
          document.documentElement.style.setProperty('--select-content-height', `${contentHeight}px`);
        }, 0);

        // Store these values in CSS variables for consistency
        document.documentElement.style.setProperty('--select-trigger-top', `${triggerRect.top + window.scrollY}px`);
        document.documentElement.style.setProperty('--select-trigger-left', `${triggerRect.left}px`);
        document.documentElement.style.setProperty('--select-trigger-width', `${triggerRect.width}px`);
        document.documentElement.style.setProperty('--select-trigger-height', `${triggerRect.height}px`);

        // Set width and other properties
        (contentWrapper as HTMLElement).style.width = `${triggerRect.width}px`;
        (contentWrapper as HTMLElement).style.maxWidth = `${triggerRect.width}px`;
        (contentWrapper as HTMLElement).style.transform = 'none';

        // Ensure the content inside has the correct width
        const content = contentWrapper.querySelector('[data-radix-select-content]');
        if (content) {
          (content as HTMLElement).style.width = '100%';
          (content as HTMLElement).style.maxWidth = '100%';
        }
      };

      // Create a mutation observer to watch for dropdown opening
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
            const target = mutation.target as HTMLElement;
            if (target.getAttribute('data-state') === 'open') {
              // Position the dropdown when it opens
              setTimeout(positionDropdown, 0);
            }
          }
        });
      });

      // Start observing the document for dropdown changes
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-state']
      });

      // Cleanup observer on unmount
      return () => {
        observer.disconnect();
      };
    }
  }, [isMobile]);

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={handleRef}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          isMobile ? "select-content-mobile" : "select-content-desktop",
          className
        )}
        position={position}
        // Ensure dropdown stays within viewport
        avoidCollisions={!isMobile}
        // Prevent dropdown from causing page shift
        collisionPadding={isMobile ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 8, right: 8, bottom: 8, left: 8 }}
        // Default side - top for mobile, bottom for desktop
        side={isMobile ? "top" : "bottom"}
        sideOffset={5}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
