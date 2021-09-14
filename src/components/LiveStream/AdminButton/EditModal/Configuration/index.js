import { h } from 'preact';
import { connect } from 'react-redux';
import { useRef, useState, useEffect } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';

import ImageSelector from 'Components/ImageSelector';
import { PrimaryButton } from 'Components/Buttons';
import { buildURL} from 'Shared/fetch';

import style from './style.scss';

const Configuration = ({
  habitatId,
}) => {
  const [videoURL, setVideoURL] = useState(undefined);
  const [validationError, setValidationError] = useState();
  const videoSelectorRef = useRef();

  const {
    post,
    loading,
    error: patchError,
  } = useFetch(
    buildURL(`admin/habitats/${habitatId}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const {
    get,
    data: habitatTrailerData,
    response: habitatTrailerResponse,
  } = useFetch(buildURL(`/habitats/${habitatId}/trailer`), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (habitatId) {
      get();
    }
  }, [habitatId, get])

  useEffect(() => {
    if (habitatTrailerResponse.status === 200) {
      setVideoURL(habitatTrailerData.videoURL);
    }
  }, [habitatTrailerData, habitatTrailerResponse])
  const onPublish = async () => {
    const isValid = await videoSelectorRef.current.validate();

    if (isValid) {
      setValidationError(false);
      await post("/trailer", { videoURL });
    } else {
      setValidationError('Your input is not valid.');
    }
  }

  return (
    <Box justify="center" align="center" flex="grow">
      <Box fill align="stretch" direction="row">
        <Box width="500px" pad="medium">
          <Box margin={{ top: 'medium' }} pad={{ horizontal: 'medium' }} className="customScrollBar grey">

            <Box margin={{ bottom: '20px' }}>
              <Heading margin={{ top: '0', bottom: '5px' }} level="5">Habitat Trailer</Heading>
              <ImageSelector
                url={videoURL}
                ref={videoSelectorRef}
                placeholder="https://"
                constraints={{
                  acceptedFormats: ['mp4'],
                  maxFileSize: 8_000_000,
                }}
                onChange={(value) => setVideoURL(value)}
              />
            </Box>

            <Box>
              {(patchError || validationError) && (
                <Box pad={{ vertical: 'medium' }}>
                  <Text size="14px" textAlign="center" color="status-error" margin={{ top: '10px'}}>
                    {!patchError && (validationError || 'Please check your input and try again')}
                    {patchError && 'Please try again'}
                  </Text>
                </Box>
              )}
              <PrimaryButton
                label="Publish"
                loading={loading}
                onClick={onPublish}
                className={style.publish}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
      },
    },
  }) => ({
    habitatId,
  }),
)(Configuration);
