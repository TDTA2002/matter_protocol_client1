import "./loading.scss";
import load from './pngtree-loading-icon-vector-transparent-png-image_5687537.png'

export default function Loading() {
    return (
        <div className="loading_container">
            <img
                className="rotating-image"
                src={load}
            />
        </div>

    );
}