import { h } from 'preact';
import {
  Box,
  Form,
  Heading,
  Layer,
  Text,
  TextInput,
} from 'grommet';
import { useMemo, useState } from 'preact/hooks';
import { PrimaryButton } from 'Components/Buttons';
import Header from 'Components/modals/Header';

const DeleteModal = ({
  item,
  columns,
  entity,
  onDelete,
  onClose,
}) => {
  const deleteInfoColumns = useMemo(
    () => columns.filter(({ deleteInfo }) => deleteInfo),
    [columns],
  );
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
      <Header onClose={onClose}>
        {`Delete ${entity}`}
      </Header>

      <Form onSubmit={onSubmit}>
        <Box pad={{ vertical: 'medium', horizontal: 'large' }}>
          <Heading level="4">
            Are you sure you want to delete this
            {' '}
            {entity.toLowerCase()}
            ?
          </Heading>

          <Text size="large">
            {deleteInfoColumns.map(({ property, title }) => (
              <>
                {`${title}: ${item?.[property] || ''}`}
                <br />
              </>
            ))}
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
