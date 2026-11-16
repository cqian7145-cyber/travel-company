import {Children,isValidElement,type ReactNode,type ButtonHTMLAttributes} from 'react';
import {Button} from '@astryxdesign/core/Button';

export function buttonText(children:ReactNode):string {
 return Children.toArray(children).map(child=>typeof child==='string'||typeof child==='number'?String(child):isValidElement<{children?:ReactNode}>(child)?buttonText(child.props.children):'').join(' ').replace(/\s+/g,' ').trim();
}

/** Retain each existing action, native disabled state and form behavior. */
export function MatchaButton({children,className='',disabled,type,...props}:ButtonHTMLAttributes<HTMLButtonElement>) {
 return <Button {...props} {...{disabled}} type={type??'submit'} isDisabled={disabled}
  label={props['aria-label']||buttonText(children)} size="lg"
  variant={className.includes('primary-button')?'primary':'secondary'}
  width={className.includes('full-button')?'100%':undefined} className={className}>
  <span className="matcha-button-content">{children}</span>
 </Button>;
}
