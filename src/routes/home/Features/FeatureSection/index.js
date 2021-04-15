import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import {
  Box,
  ResponsiveContext,
  Heading,
  Text,
} from 'grommet';
import { LandingSecondary } from 'Components/Buttons';

const FeatureSection = () => {
  const size = useContext(ResponsiveContext);
  const direction = ['xsmall', 'small', 'medium'].includes(size) ? 'column-reverse' : 'row';

  return (
    <Box
      direction={direction}
      pad={{ horizontal: direction === 'column-reverse' ? 'large' : 'xlarge', vertical: 'medium' }}
    >
      <Box
        justify="start"
        alignContent="center"
        basis="1/2"
      >
        <Box pad={{ right: direction === 'column-reverse' ? 'large' : 'xlarge'}}>
          <Heading textAlign="start" level="2">
            Get closer than you&apos;ve ever been.
          </Heading>
          <Text textAlign="start" size="18px">
            Use audience-guided cameras to observe animals and expore habitats stunningly close.
          </Text>
          <Box alignSelf="start" margin={{ top: '50px' }}>
            <LandingSecondary onClick={() => route('/signup')}>Explore a Habitat</LandingSecondary>
          </Box>
        </Box>
      </Box>
      <Box
        basis="1/2"
        justify="center"
        alignContent="center"
      >
        <Box
          justify="center"
          alignSelf="center"
          style={{ position: 'relative' }}
          pad={direction === 'column-reverse' ? 'large' : ''}
        >
          {direction === 'row' && (
            <img
              src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_macbook.png"
              alt="laptop mockup"
              style={{
                position: 'absolute',
                zIndex: 2,
                left: '-10%',
                maxWidth: '535px',
                top: '-2.5%',
              }}
            />
          )}
          <video
            autoPlay
            loop
            muted
            playInline
            style={{
              width: direction === "row" ? "450px" : "100%",
              zIndex: 1,
              borderRadius: '2px',
            }}
          >
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_camera.webm" type="video/webm" />
            <source src="https://zl-brizi-tv.s3.ca-central-1.amazonaws.com/assets/landing/s4_camera.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureSection;
