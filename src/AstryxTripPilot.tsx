import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {themes,defaultThemeSlug} from './astryx-themes';
import './astryx-pilot.css';

/** Load the official components and their styles only when My Trip is opened. */
export default function AstryxTripPilot({children}:{children:(components:{Button:typeof Button;Card:typeof Card})=>ReactNode}) {
  return <Theme theme={themes[defaultThemeSlug]} mode="light">{children({Button,Card})}</Theme>;
}
