import { cloneElement, toChildArray } from 'preact';
import { Box } from 'grommet';

const PageWrapper = ({ children, ...props }) => {
  const childrenWithProps = toChildArray(children)
    .map((child) => child && cloneElement(child, props));

  return (
    <Box fill pad={{ top: 'var(--headerHeight)' }}>
      <Box fill overflow="auto">
        <Box fill width={{ max: "1650px", min: "350px" }} margin={{ horizontal: 'auto' }}>
          {childrenWithProps}
        </Box>
      </Box>
    </Box>
  );
}

export default PageWrapper;
