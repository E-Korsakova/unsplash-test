import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import deleteIcon from '../../assets/icons/delete.svg';

import { useAppDispatch } from '../../hooks'
import { useState } from 'react'

import styles from './SearchPanel.module.scss'
import { getImages, setCurrentPage, setCurrentQuery } from '../../store/imagesSlice'

type SearchPanelProps = {
    isStart: boolean;
    setIsStart: (value: boolean) => void;
}

export const SearchPanel = ({isStart, setIsStart}: SearchPanelProps) => {

    const [query, setQuery] = useState('');
    const dispatch = useAppDispatch();

    const search = () => {
        setIsStart(true);
        dispatch(setCurrentQuery(query));
        for (let i = 1; i <= 5; i++) {
            dispatch(getImages({query, page: i}))
            dispatch(setCurrentPage(i))
        }
        dispatch(setCurrentPage(6));
    }
    return (
        <form className={isStart ? styles.onSearchPanel: styles.searchPanel}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon}/>
            <input className={styles.input} 
                value={query} type="text" 
                placeholder="Телефоны, яблоки, груши..." 
                enterKeyHint='enter' 
                onChange={(evt) => setQuery(evt.target.value)}
            />
            {query && <img src={deleteIcon} alt='click to clear the search query' className={isStart ? styles.deleteIconOnSearch : styles.deleteIcon} onClick={() => {
                setQuery('');
                dispatch(setCurrentQuery(''));
                setIsStart(false);
            }}/>}
            <button type='submit' className={styles.button} onClick={(evt) => {
                evt.preventDefault();
                search();
                }}>Искать</button>
        </form>
    )
}