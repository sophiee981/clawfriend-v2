import { ArrowUp } from '../icons'

export const ScrollButton = ({ scrollToTop }: { scrollToTop: () => void }) => {
    return (
        <button
            onClick={scrollToTop}
            className="p-2 bg-primary hover:bg-primary/80 text-white rounded-full shadow-lg transition-all duration-300 pointer-events-auto"
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    )
}