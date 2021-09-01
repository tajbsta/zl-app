import { h } from 'preact';
import { connect } from 'react-redux';
import { useMemo } from 'preact/hooks';

import { getIconUrl, getIconKeys } from 'Shared/profileIcons';

import style from './style.scss';

const AnimalIcon = ({
  animalIcon,
  color,
  width = 30,
  userIcon,
  userColor,
}) => {
  const userIconUrl = useMemo(() => {
    // in case of old solution where we were saving URLs,
    // initial value will be undefined after a user signup
    if (userIcon?.endsWith('.svg')) {
      return userIcon;
    }
    // getIconUrl(getIconKeys()[0]) is defensive part in case 'userIcon' is not found
    return getIconUrl(userIcon) || getIconUrl(getIconKeys()[0]);
  }, [userIcon]);

  const animalIconUrl = useMemo(() => {
    if (!animalIcon) {
      return null;
    }
    // in case of old solution where we were saving URLs,
    // initial value will be undefined after a user signup
    if (animalIcon?.endsWith('.svg')) {
      return animalIcon;
    }
    // getIconUrl(getIconKeys()[0]) is defensive part in case 'userIcon' is not found
    return getIconUrl(animalIcon) || getIconUrl(getIconKeys()[0]);
  }, [animalIcon]);

  return (
    <div
      style={{
        backgroundColor: color || userColor,
        width,
        height: width,
        minWidth: width,
        minHeight: width,
      }}
      className={style.animalIcon}
    >
      <img src={animalIconUrl || userIconUrl} alt="animal" />
    </div>
  )
}

export default connect((
  { user: { profile: { animalIcon: userIcon, color: userColor } = {}, logged } },
) => (
  { userIcon, userColor, logged }
))(AnimalIcon);
