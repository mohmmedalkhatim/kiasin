import {
    useEffect,
    useRef,
    ReactNode,
    forwardRef,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface DialogProps {
    open: boolean;
    onClose: () => void;

    title?: string;
    description?: string;

    children: ReactNode;
    widthClass:string
    closeOnOverlayClick?: boolean;

    overlayClassName?: string;
    panelClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
    (
        {
            open,
            onClose,

            title,
            description,
            children,

            closeOnOverlayClick = true,
            widthClass,
            overlayClassName,
            panelClassName,
            headerClassName,
            bodyClassName,
        },
        ref
    ) => {
        const panelRef = useRef<HTMLDivElement | null>(null);
        const lastActiveElement = useRef<HTMLElement | null>(null);

        useEffect(() => {
            if (!open) return;

            lastActiveElement.current =
                document.activeElement as HTMLElement;

            panelRef.current?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    onClose();
                }

                if (e.key === "Tab" && panelRef.current) {
                    const focusable = panelRef.current.querySelectorAll<
                        HTMLElement
                    >(
                        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                    );

                    if (!focusable.length) return;

                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];

                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (
                        !e.shiftKey &&
                        document.activeElement === last
                    ) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            };

            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "";
                lastActiveElement.current?.focus();
            };
        }, [open, onClose]);

        if (!open) return null;

        return createPortal(
            <div
                className={twMerge(
                    clsx(
                        "fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80",
                        overlayClassName
                    )
                )}
                onMouseDown={() => {
                    if (closeOnOverlayClick) onClose();
                }}
            >
                <div
                    ref={(node) => {
                        panelRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "dialog-title" : undefined}
                    aria-describedby={
                        description ? "dialog-description" : undefined
                    }
                    tabIndex={-1}
                    className={twMerge(
                        clsx(
                            "bg rounded shadow-sm border border-border-main outline-none",
                            "flex flex-col",
                            widthClass,
                            panelClassName
                        )
                    )}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {(title || description) && (
                        <div
                            className={twMerge(
                                "border-b border-border-main px-6 py-4",
                                headerClassName
                            )}
                        >
                            {title && (
                                <h2
                                    id="dialog-title"
                                    className="text-lg font-semibold"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id="dialog-description"
                                    className="text-sm text-gray-500"
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    <div
                        className={twMerge(
                            "py-4 flex-1",
                            bodyClassName
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>,
            document.body
        );
    }
);

Dialog.displayName = "Dialog";
