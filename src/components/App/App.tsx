import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getImages, setActiveImage, setActiveModal, setCurrentPage } from '../../store/imagesSlice';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './App.module.scss'
import { SearchPanel } from '../SearchPanel';
import { Modal } from '../Modal';

export const App: React.FC = () => {
  const [isStart, setIsStart] = useState(false);

  const dispatch = useAppDispatch();
  const {results, currQuery, hasMore, currentPage, loading, isError, activeModal} = useAppSelector((state) => state.images)

  return (
    <div className={isStart ? styles.appOnSearch : styles.app} id="scrollableDiv">
      {/* {results.map((img) => {
        return (
          <div key={img.id}>
            <img src={img.urls.regular} alt={img.alt_description} />
            <img src={img.urls.small} alt={img.alt_description} />
            <img src={img.urls.thumb} alt={img.alt_description} />
          </div>
        )
      })} */}
      <Modal active={activeModal}/>
      <SearchPanel setIsStart={setIsStart} isStart={isStart}/>
      {currQuery && !loading && currentPage === 1 && !isError && <span className={styles.noResultText}>К сожалению, поиск не дал результатов</span>}
      <div id="scrollableDiv">
        {results.length > 0 && (
          <InfiniteScroll
            dataLength={results.length}
            next={() => {
              if (hasMore && !isError) {
                dispatch(getImages({query: currQuery, page: currentPage}))
                dispatch(setCurrentPage(currentPage + 1))
              }
            }}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            <div className={styles.gallery}>
              {results.map((img) => (
                <div className={styles.container} key={img.id}>
                  <img 
                    src={window.innerWidth > 1360 ? img.urls.small : img.urls.thumb} 
                    alt={img.alt_description} 
                    className={styles.img}
                    onClick={() => {
                      dispatch(setActiveImage(img));
                      dispatch(setActiveModal(true));
                    }}
                  />
                </div>
              ))}
              {hasMore && Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className={styles.emptyContainer}>
                  <div className={styles.imgPlaceholder}></div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}