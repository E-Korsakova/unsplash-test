import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveImage, setActiveModal } from '../../store/imagesSlice';
import styles from './Modal.module.scss';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type ModalProps = {
    active: boolean;
}

export const Modal = ({active}: ModalProps) => {
    const dispatch = useAppDispatch();
    const {activeImage} = useAppSelector((state) => state.images)
    const close = () => {
        dispatch(setActiveModal(false));
        dispatch(setActiveImage(null));
    }
    return (
        <div className={active ? styles.modalActive : styles.modal} onClick={close}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                {activeImage && <img src={activeImage.urls.regular} className={styles.img} alt={activeImage.alt_description}></img>}
            </div>

            {active && <FontAwesomeIcon icon={faCircleXmark} className={styles.icon} onClick={close}/>}
        </div>
    )
};