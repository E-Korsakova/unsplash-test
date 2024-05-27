// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveImage, setActiveModal } from '../../store/imagesSlice';
import closeIcon from '../../assets/icons/close.svg'
import styles from './Modal.module.scss';
import { useEffect } from 'react';
// import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

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

    useEffect(() => {
    
        if (active) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [active]);

    return (
        <div className={active ? styles.modalActive : styles.modal} onClick={close} onTouchMove={(e) => {
                e.preventDefault();
                close();
            }}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                {activeImage && <img src={activeImage.urls.regular} className={styles.img} alt={activeImage.alt_description} />}
            </div>

            {/* {active && <FontAwesomeIcon icon={faCircleXmark} className={styles.icon} onClick={close}/>} */}
            {active && <img src={closeIcon} className={styles.icon} alt='click to close image'onClick={close}/>}
        </div>
    )
};