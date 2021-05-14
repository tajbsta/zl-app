import { h } from 'preact';
import {
  Box,
  Button,
  Form,
  Heading,
  Layer,
  Text,
  TextInput,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'preact/hooks';
import { PrimaryButton } from 'Components/Buttons';

const DeleteModal = ({ selected, onDelete, onClose }) => {
  const [confirmation, setConfirmation] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await onDelete(evt);
      setError(undefined);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box
        width="large"
        direction="row"
        align="center"
        as="header"
        elevation="small"
        justify="between"
      >
        <Heading level="2" margin={{ vertical: 'medium', horizontal: 'large' }}>
          Delete User
        </Heading>
        <Button
          plain
          margin="medium"
          onClick={onClose}
          icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
        />
      </Box>

      <Form onSubmit={onSubmit}>
        <Box pad={{ vertical: 'medium', horizontal: 'large' }}>
          <Heading level="4">
            Are you sure you want to delete this user
          </Heading>

          <Text size="large">
            {selected?.email}
          </Text>

          <Text margin={{ top: 'medium', bottom: 'small' }} size="large">
            Type &quot;delete&quot; here to confirm:
          </Text>
          <TextInput
            name="confirmation"
            value={confirmation}
            onChange={({ target }) => setConfirmation(target.value)}
          />
        </Box>

        <Box pad={{ vertical: 'medium', horizontal: 'large' }} align="end">
          <PrimaryButton
            label="Delete"
            type="submit"
            loading={loading}
            disabled={confirmation !== 'delete'}
          />

          {error && (
            <Box pad="small">
              <Text color="status-error">{error}</Text>
            </Box>
          )}
        </Box>
      </Form>
    </Layer>
  );
};

export default DeleteModal;
