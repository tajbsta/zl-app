import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useState, useImperativeHandle } from 'preact/hooks';
import {
  Box,
  Text,
  Heading,
  TextArea,
  TextInput,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';

import { CRITICALLY_ENDANGERED, ENDANGERED, EXTINCT_IN_THE_WILD } from '../../../constants';
import { isValidUrl } from '../../../../../../../helpers';

import style from './style.scss';

const ConservationCardForm = forwardRef(({
  status,
  title,
  text,
  btnLabel,
  btnLink,
  onInputChange,
}, ref) => {
  const [titleErrorMsg, setTitleErrorMsg] = useState();
  const [textErrorMsg, setTextErrorMsg] = useState();
  const [btnLinkErrorMsg, setBtnLinkErrorMsg] = useState();

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;

      if (!title || title.length === 0) {
        setTitleErrorMsg('Title is required');
        isValid = false;
      }

      if (!text || text.length === 0) {
        setTextErrorMsg('Text is required');
        isValid = false;
      }

      if (!isValidUrl(btnLink)) {
        setBtnLinkErrorMsg('Invalid URL');
        isValid = false;
      }

      return isValid;
    },
  }));

  useEffect(() => setTitleErrorMsg(undefined), [title]);
  useEffect(() => setTextErrorMsg(undefined), [text]);
  useEffect(() => setBtnLinkErrorMsg(undefined), [btnLink]);

  return (
    <>
      <div className="simpleSelect">
        <select onChange={onInputChange} data-prop="status">
          <option selected={status === ENDANGERED} value={ENDANGERED}>
            Endangered
          </option>
          <option selected={status === CRITICALLY_ENDANGERED} value={CRITICALLY_ENDANGERED}>
            Critically Endangered
          </option>
          <option selected={status === EXTINCT_IN_THE_WILD} value={EXTINCT_IN_THE_WILD}>
            Extinct In The Wild
          </option>
        </select>

        <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
      </div>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Title:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={title}
            data-prop="title"
            onChange={onInputChange}
            maxLength="45"
            rows="2"
            className={style.textarea}
          />
          <span className={style.bottomRight}>
            {title?.length ?? 0}
            /45
          </span>
        </div>
        {titleErrorMsg && (
          <Box>
            <Text color="status-error">{titleErrorMsg}</Text>
          </Box>
        )}
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Description:</Heading>
        <div className={style.textAreaWrapper}>
          <TextArea
            value={text}
            className={style.textarea}
            rows="6"
            data-prop="text"
            onChange={onInputChange}
            maxLength="180"
          />
          <span className={style.bottomRight}>
            {text?.length ?? 0}
            /180
          </span>
        </div>
        {textErrorMsg && (
          <Box>
            <Text color="status-error">{textErrorMsg}</Text>
          </Box>
        )}
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Button Title:</Heading>
        <TextInput
          reverse
          value={btnLabel}
          data-prop="btnLabel"
          onChange={onInputChange}
          maxLength="25"
          icon={(
            <span>
              {btnLabel?.length ?? 0}
              /25
            </span>
          )}
        />
      </Box>

      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Button Link:</Heading>
        <TextInput
          reverse
          value={btnLink}
          data-prop="btnLink"
          onChange={onInputChange}
        />
        {btnLinkErrorMsg && (
          <Box>
            <Text color="status-error">{btnLinkErrorMsg}</Text>
          </Box>
        )}
      </Box>
    </>
  );
});

export default ConservationCardForm;
