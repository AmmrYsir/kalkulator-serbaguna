import { Component, JSX } from 'solid-js';

interface PageTransitionProps {
  children: JSX.Element;
}

const PageTransition: Component<PageTransitionProps> = (props) => {
  return (
    <div class="animate-fade-in">
      {props.children}
    </div>
  );
};

export default PageTransition;
