import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {themes,defaultThemeSlug} from './astryx-themes';

/** One official theme boundary for every page, including dialogs and tools. */
export default function MatchaTheme({children}:{children:ReactNode}) {
 return <Theme theme={themes[defaultThemeSlug]} mode="light">{children}</Theme>;
}
