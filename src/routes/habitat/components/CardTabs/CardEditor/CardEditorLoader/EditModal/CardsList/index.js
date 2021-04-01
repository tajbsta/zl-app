import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  Heading,
  Box,
  Text,
  RadioButton,
} from 'grommet';

import List from 'Components/List';
import SingleIconCard from 'Cards/SingleIconCard';
import ThreeIconsCard from 'Cards/ThreeIconsCard';
import FourIconsCard from 'Cards/FourIconsCard';
import AnimalProfileCard from 'Cards/AnimalProfileCard';
import ConservationCard from 'Cards/ConservationCard';
import TwoVideosCard from 'Cards/TwoVideosCard';
import SingleVideoCard from 'Cards/SingleVideoCard';
import OriginAndHabitatCard from 'Cards/OriginAndHabitatCard';
import AnimalBodyCard from 'Cards/AnimalBodyCard';
import QuizCard from 'Cards/QuizCard';

import { PrimaryButton } from 'Components/Buttons';
import {
  tag as singleIconCardTag,
  type as singleIconCardType,
  data as singleIconCardData,
} from 'Cards/SingleIconCard/sampleData';
import {
  tag as threeIconsCardTag,
  type as threeIconsCardType,
  data as threeIconsCardData,
} from 'Cards/ThreeIconsCard/sampleData';
import {
  tag as fourIconsCardTag,
  type as fourIconsCardType,
  data as fourIconsCardData,
} from 'Cards/FourIconsCard/sampleData';
import {
  tag as animalProfileCardTag,
  type as animalProfileCardType,
  data as animalProfileCardData,
} from 'Cards/AnimalProfileCard/sampleData';
import {
  tag as conservationCardTag,
  type as conservationCardType,
  data as conservationCardData,
} from 'Cards/ConservationCard/sampleData';
import {
  tag as twoVideosCardTag,
  type as twoVideosCardType,
  data as twoVideosCardData,
} from 'Cards/TwoVideosCard/sampleData';
import {
  tag as singleVideoCardTag,
  type as singleVideoCardType,
  data as singleVideoCardData,
} from 'Cards/SingleVideoCard/sampleData';
import {
  tag as originAndHabitatCardTag,
  type as originAndHabitatCardType,
  data as originAndHabitatCardData,
} from 'Cards/OriginAndHabitatCard/sampleData';
import {
  tag as animalBodyCardTag,
  type as animalBodyCardType,
  data as animalBodyCardData,
} from 'Cards/AnimalBodyCard/sampleData';
import {
  tag as quizCardTag,
  type as quizCardType,
  data as quizCardData,
} from 'Cards/QuizCard/sampleData';

import {
  BODY,
  INFO,
  MEET,
  QUIZ,
} from '../../../../constants';

import style from './style.scss';

const CardsList = ({ activeTab, canCreateQuizCard, onContinue }) => {
  // TODO: we'll need to render the list based on the tab
  const listRef = useRef();
  const [selectedType, setSelectedType] = useState();
  const [selectedTag, setSelectedTag] = useState();
  const [selectedData, setSelectedData] = useState();

  // this should be called when list is ready
  // and we know the width of all items
  // we can assume it's ready immediatelly on mount
  useEffect(() => {
    listRef.current.updateLayout();
  }, []);

  const onSingleIconCardClick = () => {
    setSelectedType(singleIconCardType);
    setSelectedTag(singleIconCardTag);
    setSelectedData(singleIconCardData);
  };

  const onThreeIconsCardClick = () => {
    setSelectedType(threeIconsCardType);
    setSelectedTag(threeIconsCardTag);
    setSelectedData(threeIconsCardData);
  };

  const onFourIconsCardClick = () => {
    setSelectedType(fourIconsCardType);
    setSelectedTag(fourIconsCardTag);
    setSelectedData(fourIconsCardData);
  };

  const onAnimalProfileCardClick = () => {
    setSelectedType(animalProfileCardType);
    setSelectedTag(animalProfileCardTag);
    setSelectedData(animalProfileCardData);
  };

  const onConservationCardClick = () => {
    setSelectedType(conservationCardType);
    setSelectedTag(conservationCardTag);
    setSelectedData(conservationCardData);
  };

  const onTwoVideosCardClick = () => {
    setSelectedType(twoVideosCardType);
    setSelectedTag(twoVideosCardTag);
    setSelectedData(twoVideosCardData);
  };

  const onSingleVideoCardClick = () => {
    setSelectedType(singleVideoCardType);
    setSelectedTag(singleVideoCardTag);
    setSelectedData(singleVideoCardData);
  };

  const onOriginAndHabitatCardClick = () => {
    setSelectedType(originAndHabitatCardType);
    setSelectedTag(originAndHabitatCardTag);
    setSelectedData(originAndHabitatCardData);
  };

  const onAnimalBodyCardClick = () => {
    setSelectedType(animalBodyCardType);
    setSelectedTag(animalBodyCardTag);
    setSelectedData(animalBodyCardData);
  }

  const onQuizCardClick = () => {
    setSelectedType(quizCardType);
    setSelectedTag(quizCardTag);
    setSelectedData(quizCardData);
  };

  const onContinueBtnClick = () => {
    onContinue(selectedType, selectedTag, selectedData);
  }

  return (
    <Box flex="grow" width="100%">
      <Heading textAlign="center" alignSelf="center" margin={{ top: '0', bottom: '0' }} level="2">
        Add Card
      </Heading>
      <Text size="xlarge" textAlign="center">Select a template to customize.</Text>

      <Box flex="grow" width={{ max: '1190px' }}>
        <List ref={listRef}>
          {activeTab === INFO && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onSingleIconCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Single Icon</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <SingleIconCard {...singleIconCardData} tag={singleIconCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === singleIconCardType} />
              </Box>
            </div>
          )}

          {activeTab === INFO && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onThreeIconsCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Three Icons</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <ThreeIconsCard {...threeIconsCardData} tag={threeIconsCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === threeIconsCardType} />
              </Box>
            </div>
          )}

          {activeTab === INFO && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onFourIconsCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Four Icons</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <FourIconsCard {...fourIconsCardData} tag={fourIconsCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === fourIconsCardType} />
              </Box>
            </div>
          )}

          {activeTab === MEET && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onAnimalProfileCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Animal Profile</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <AnimalProfileCard {...animalProfileCardData} tag={animalProfileCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === animalProfileCardType} />
              </Box>
            </div>
          )}

          {activeTab === INFO && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onConservationCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Conservation</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <ConservationCard {...conservationCardData} tag={conservationCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === conservationCardType} />
              </Box>
            </div>
          )}

          {(activeTab === INFO || activeTab === MEET) && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onTwoVideosCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Two Videos</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <TwoVideosCard {...twoVideosCardData} tag={twoVideosCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === twoVideosCardType} />
              </Box>
            </div>
          )}

          {/* this type of card is available on all tabs */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div className={style.item} role="button" tabIndex="0" onClick={onSingleVideoCardClick}>
            <Text size="xlarge" margin="small" textAlign="center">Single Video</Text>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <SingleVideoCard {...singleVideoCardData} tag={singleVideoCardTag} />
            <Box pad="small">
              <RadioButton name="card" checked={selectedType === singleVideoCardType} />
            </Box>
          </div>

          {activeTab === INFO && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onOriginAndHabitatCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Origin And Habitat</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <OriginAndHabitatCard {...originAndHabitatCardData} tag={originAndHabitatCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === originAndHabitatCardType} />
              </Box>
            </div>
          )}

          {activeTab === BODY && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onAnimalBodyCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Animal Body</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <AnimalBodyCard {...animalBodyCardData} tag={animalBodyCardTag} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === animalBodyCardType} />
              </Box>
            </div>
          )}

          {activeTab === QUIZ && canCreateQuizCard && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={style.item} role="button" tabIndex="0" onClick={onQuizCardClick}>
              <Text size="xlarge" margin="small" textAlign="center">Quiz</Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <QuizCard {...quizCardData} />
              <Box pad="small">
                <RadioButton name="card" checked={selectedType === quizCardType} />
              </Box>
            </div>
          )}
        </List>
      </Box>

      <Box border="top" pad="medium" align="center">
        <PrimaryButton
          disabled={!selectedType}
          label="Continue"
          onClick={onContinueBtnClick}
        />
      </Box>
    </Box>
  );
};

export default CardsList;
