import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FetchApi } from 'services/fetchApi';
import { Container } from './App.styled';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Notification } from './Notification/Notification';
import { Searchbar } from './Searchbar/Searchbar';

export const App = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [data, setData] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function fetchImages() {
      setIsLoading(true);

      FetchApi.fetchImages(page, query)
        .then(resp => {
          setImages(state => [...state, ...resp])
        }
        )
        .catch(err => {
          setError(err.message);
          toast.error(`${err.message}`, { position: 'top-center' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (query) {
      fetchImages();
    }
  }, [page, query]);

  function handleSubmit(evt) {
    evt.preventDefault();
    const value = evt.currentTarget.elements.search.value.trim();
    if (!value) {
      const textError = 'Please enter a valid value';
      setError(textError);
      toast.error(`${textError}`, { position: 'top-center' });
      evt.target.reset();
      return;
    }
    setPage(1);
    setQuery(value);
    setImages([]);
    evt.target.reset();
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onModalOpen = data => {
    setIsOpenModal(true);
    setData(data);
  };

  const onModalClose = () => {
    setIsOpenModal(false);
    setData(null);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {error && <ToastContainer />}
      {images.length > 0 && (
        <ImageGallery images={images} onOpen={onModalOpen} />
      )}
      {isLoading && <Loader />}
      {images.length > 0 && page < FetchApi.maxPage && (
        <Button handleClick={loadMore} />
      )}
      {!isLoading && page === FetchApi.maxPage && (
        <Notification message="These are all pictures on request" />
      )}
      {isOpenModal && <Modal url={data} onClose={onModalClose} />}
    </Container>
  );
}
