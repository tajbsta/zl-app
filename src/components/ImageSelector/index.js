import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { isEmpty } from 'lodash-es';
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useImperativeHandle,
} from 'preact/hooks';
import {
  Box,
  Text,
  Heading,
  TextInput,
} from 'grommet';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { OutlineButton } from 'Components/Buttons';

import { fromUrlToS3, getHeaders, uploadFile } from './api';

import style from './style.scss';

const RESOLUTION_CONSTRAINT = 'RESOLUTION_CONSTRAINT';
const FILE_SIZE_CONSTRAINT = 'FILE_SIZE_CONSTRAINT';
const ASPECT_RATIO_CONSTRAINT = 'ASPECT_RATIO_CONSTRAINT';
const ACCEPTED_FORMAT_CONSTRAINT = 'ACCEPTED_FORMAT_CONSTRAINT';
const WIDTH_CONSTRAINT = 'WIDTH_CONSTRAINT';
const HEIGHT_CONSTRAINT = 'HEIGHT_CONSTRAINT';

const ValidationLine = ({ error, text }) => (
  <Text color={error ? 'status-error' : undefined}>{text}</Text>
);

const Constraints = ({ constraints, errors }) => constraints.map(({ type, text }, ind) => (
  <>
    <ValidationLine error={errors[type]} text={text} />
    {ind !== constraints.length - 1 && (', ')}
  </>
));

const ImageSelector = forwardRef(({
  label,
  url,
  placeholder,
  required,
  // preview image ref that we can used to validate resolution
  previewRef,
  constraints: {
    maxResolution,
    minResolution,
    width,
    height,
    maxFileSize,
    aspectRatio,
    acceptedFormats = [],
  } = {},
  className,
  style: styleProp,
  onChange,
}, ref) => {
  const [isLoading, setIsLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [errors, setErrors] = useState({});
  const acceptedFormatsStr = acceptedFormats.map((format) => `.${format}`).join(',');
  const origin = `${process.env.PREACT_APP_HTTP_PROTOCOL}${process.env.PREACT_APP_API_AUTHORITY}`.replace('api.', '');

  useEffect(() => setErrorMsg(undefined), [url]);

  const validateConstraints = useCallback(async () => {
    const newErrors = {};
    const headers = await getHeaders(url);

    if (acceptedFormats && acceptedFormats.length > 0
      && ((!required && !isEmpty(url)) || required)) {
      const [imgFormat] = headers
        .get('content-type')
        .split('/')
        .reverse();
      if (!acceptedFormats.some((format) => url?.endsWith(format))
        && !acceptedFormats.some((format) => format === imgFormat)) {
        newErrors[ACCEPTED_FORMAT_CONSTRAINT] = true;
      } else {
        newErrors[ACCEPTED_FORMAT_CONSTRAINT] = false;
      }
    }

    if (maxFileSize && maxFileSize < headers.get('content-length')) {
      newErrors[FILE_SIZE_CONSTRAINT] = true;
    } else {
      newErrors[FILE_SIZE_CONSTRAINT] = false;
    }

    // we assume the new image is loaded while we were waiting for head request in getHeaders
    if (previewRef?.current) {
      const imgWidth = previewRef.current.naturalWidth;
      const imgHeight = previewRef.current.naturalHeight;

      if ((maxResolution && (imgWidth > maxResolution || imgHeight > maxResolution))
        || (minResolution && (imgWidth < maxResolution || imgHeight < maxResolution))
      ) {
        newErrors[RESOLUTION_CONSTRAINT] = true;
      } else {
        newErrors[RESOLUTION_CONSTRAINT] = false;
      }

      if (width && width !== imgWidth) {
        newErrors[WIDTH_CONSTRAINT] = true;
      } else {
        newErrors[WIDTH_CONSTRAINT] = false;
      }
      if (height && height !== imgHeight) {
        newErrors[HEIGHT_CONSTRAINT] = true;
      } else {
        newErrors[HEIGHT_CONSTRAINT] = false;
      }

      if (aspectRatio) {
        const [width, height] = aspectRatio.split(':').map(Number);
        if (width / height !== imgWidth / imgHeight) {
          newErrors[ASPECT_RATIO_CONSTRAINT] = true;
        } else {
          newErrors[ASPECT_RATIO_CONSTRAINT] = false;
        }
      }
    }

    return newErrors;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    url,
    previewRef,
    maxResolution,
    minResolution,
    maxFileSize,
    aspectRatio,
    // using string here instead of acceptedFormats
    // because array is passed and it's always different
    acceptedFormatsStr,
  ]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const onLoad = async () => {
      try {
        setIsLoading(true);
        const newErrors = await validateConstraints();
        setErrors(newErrors);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const el = previewRef?.current;

    if (el) {
      el.addEventListener('load', onLoad);

      return () => {
        el.removeEventListener('load', onLoad);
      }
    }

    // no need to wait for load since we'll skip preview image in validateConstraints
    onLoad();
  }, [validateConstraints, previewRef]);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      let isValid = true;

      if (!required && isEmpty(url)) {
        return isValid
      }

      try {
        const parsedUrl = new URL(url);
        const normalizeAssetHost = parsedUrl.hostname.replace('www.', '');
        const originUrl = new URL(origin);
        const normalizedLocationHost = originUrl.hostname.replace('www.', '');

        if (normalizeAssetHost !== normalizedLocationHost) {
          setErrorMsg(`Only URLs from ${origin} are allowed`);
          return false;
        }
      } catch (err) {
        // it's probably invalid URL
        console.error(err);
      }

      if (required && (!url || url.length === 0)) {
        setErrorMsg('Media is required');
        isValid = false;
      }

      try {
        setIsLoading(true);
        const newErrors = await validateConstraints();
        if (!isEmpty(newErrors)) {
          // TODO: scroll into view if there are new errors
          setErrors({ ...errors, ...newErrors });
        }

        // if any of newErrors is true
        if (Object.values(newErrors).some((e) => e)) {
          isValid = false;
        }

        return isValid;
      } catch (err) {
        setErrorMsg('We had problems validating the image. Please check for failed network requests.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
  }));

  const constraints = useMemo(() => {
    const constraints = [];

    if (maxResolution && minResolution) {
      constraints.push({
        type: RESOLUTION_CONSTRAINT,
        text: `Resolution: >${minResolution}, <${maxResolution}`,
      });
    } else if (maxResolution) {
      constraints.push({
        type: RESOLUTION_CONSTRAINT,
        text: `Resolution: <${maxResolution}`,
      });
    } else if (minResolution) {
      constraints.push({
        type: RESOLUTION_CONSTRAINT,
        text: `Resolution: >${minResolution}`,
      });
    }

    if (width) {
      constraints.push({
        type: WIDTH_CONSTRAINT,
        text: `Width: ${width}`,
      });
    }
    if (height) {
      constraints.push({
        type: HEIGHT_CONSTRAINT,
        text: `Height: ${height}`,
      });
    }

    if (maxFileSize) {
      if (maxFileSize < 1000) {
        constraints.push({
          type: FILE_SIZE_CONSTRAINT,
          text: `File: ${maxFileSize}B`,
        });
      } else if (maxFileSize < 1000 * 1000) {
        constraints.push({
          type: FILE_SIZE_CONSTRAINT,
          text: `File: ${Math.round(maxFileSize / 1_000)}kB`,
        });
      } else {
        constraints.push({
          type: FILE_SIZE_CONSTRAINT,
          text: `File: ${Math.round(maxFileSize / (1_000_000))}MB`,
        });
      }
    }

    if (aspectRatio) {
      constraints.push({
        type: ASPECT_RATIO_CONSTRAINT,
        text: `Aspect Ratio: ${aspectRatio}`,
      });
    }

    if (acceptedFormats) {
      if (acceptedFormats instanceof Array) {
        constraints.push({
          type: ACCEPTED_FORMAT_CONSTRAINT,
          text: `Accepted Formats: ${acceptedFormats.join(', ')}`,
        })
      } else {
        throw new Error('"acceptedFormats" accepts only arrays');
      }
    }

    return constraints;
  }, [maxResolution, minResolution, width, height, maxFileSize, aspectRatio, acceptedFormats]);

  const onInputChange = async ({ target }) => {
    try {
      setIsLoading(true);
      const { path } = await uploadFile(
        target.files[0],
        maxResolution,
        acceptedFormats,
        maxFileSize,
        width,
        height,
      );
      onChange(`${origin}/${path}`);
    } catch (err) {
      const { error } = err.body;

      if (error === 'Invalid format') {
        setErrors({ ...errors, [ACCEPTED_FORMAT_CONSTRAINT]: true });
      } else if (error.includes('File too large')) {
        setErrors({ ...errors, [FILE_SIZE_CONSTRAINT]: true });
      } else {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onBlur = async ({ target }) => {
    if (!required && isEmpty(target.value)) {
      onChange(target.value);
      return;
    }

    const urlObj = new URL(target.value);
    if (urlObj.origin === origin) {
      onChange(target.value);
      return;
    }

    try {
      setIsLoading(true);
      const { path } = await fromUrlToS3(target.value);
      onChange(`${origin}/${path}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} style={styleProp}>
      {label && <Heading margin={{ top: '0', bottom: '5px' }} level="5">{label}</Heading>}
      <TextInput
        placeholder={placeholder}
        value={url}
        onBlur={onBlur}
        icon={isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : undefined}
        disabled={isLoading}
        reverse
      />
      {errorMsg && (
        <Box>
          <Text color="status-error">{errorMsg}</Text>
        </Box>
      )}
      <div className={style.constraints}>
        <Constraints constraints={constraints} errors={errors} />
      </div>

      <Box direction="row">
        <div className={style.uploadBtnWrapper}>
          <input disabled={isLoading} onChange={onInputChange} type="file" name="file" accept={acceptedFormatsStr} />
          <OutlineButton size="small" disabled={isLoading} label="Upload" margin={{ right: '5px' }} />
        </div>

        <a
          download
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={classnames({ [style.disabled]: errorMsg })}
        >
          <OutlineButton size="small" label="Download" disabled={errorMsg} />
        </a>
      </Box>
    </div>
  );
});

export default ImageSelector;
