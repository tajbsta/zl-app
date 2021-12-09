import { h } from 'preact';
import { Box, Header } from 'grommet';
import {
  faCalendarDay,
  faGift,
  faSignInAlt,
  faSignOut,
  faTicketAlt,
} from '@fortawesome/pro-solid-svg-icons';

import NavItem from 'Components/NavBar/NavItem';
import Invite from 'Components/NavBar/Invite';
import ZoolifeLogo from 'Components/ZoolifeLogo';
import BurgerMenu from 'Components/BurgerMenu';
import { LandingSecondary } from 'Components/Buttons';

import {
  goToLogin,
  goToSignup,
  goToPrices,
  goToGift,
} from '../helpers';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header} gap="none">
    <div className={style.logo}>
      <ZoolifeLogo landing />
    </div>

    <div className={style.navBar}>
      <NavItem text="Pricing" onClick={goToPrices} icon={faTicketAlt} />
      <NavItem text="Gift Cards" onClick={goToGift} icon={faGift} />
      <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
      <Invite text="Invite Friends" />
      <NavItem text="Log In" onClick={goToLogin} icon={faSignInAlt} />
      <LandingSecondary onClick={goToSignup} className={style.signUpButton}>
        Start Free Trial
      </LandingSecondary>
    </div>

    <BurgerMenu id={style.burgerMenu}>
      <NavItem text="Pricing" onClick={goToPrices} icon={faTicketAlt} />
      <NavItem text="Gift Cards" onClick={goToGift} icon={faGift} />
      <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
      <Invite text="Invite Friends" />
      <NavItem onClick={goToLogin} text="Log In" url="/login" icon={faSignOut} />
      <Box margin={{ left: '15px' }}>
        <LandingSecondary onClick={goToSignup} className={style.signUpButton}>
          Start Free Trial
        </LandingSecondary>
      </Box>
    </BurgerMenu>
  </Header>
);

export default HeaderComponent;
