
import { Loader } from 'lucide-react';

const Spinner = ({ size = "w-6 h-6", className = "" }) => {
    return (
        <Loader className={`${size} text-accent animate-spin ${className}`} />
    );
};

export default Spinner;