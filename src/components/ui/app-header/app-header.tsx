import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const getLinkClass = (isActive: boolean) =>
  `p-5 text text_type_main-default ${styles.link} ${
    isActive ? styles.link_active : ''
  }`;

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          end
          className={({ isActive }) => getLinkClass(isActive)}
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2 mr-5'>Конструктор</span>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) => getLinkClass(isActive)}
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2'>Лента заказов</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `${getLinkClass(isActive)} ${styles.link_position_last}`
        }
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <span className='ml-2'>{userName || 'Личный кабинет'}</span>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
