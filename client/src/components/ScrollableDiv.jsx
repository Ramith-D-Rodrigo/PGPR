import React from 'react'
import { useRef, useEffect, useState } from 'react';

const ScrollableDiv = ({children, ...otherprops}) => {

    let {width,height,borderRadius,backgroundColor,color,sx} = otherprops;
    const contentRef = useRef(null);
    const arrowRef = useRef(null);
    const [shouldShowArrow, setShouldShowArrow] = useState(false);

    useEffect(() => {
        const contentElement = contentRef.current;
        if (contentElement) {
          const hasOverflow = contentElement.scrollHeight > contentElement.clientHeight;
          setShouldShowArrow(hasOverflow);
        }
      }, [children]);

      const handleScroll = () => {
        const contentElement = contentRef.current;
        const arrowElement = arrowRef.current;
        
        if (
          contentElement &&
          contentElement.scrollTop + contentElement.clientHeight +contentElement.scrollHeight*10/100 >= contentElement.scrollHeight
        ) {
          setShouldShowArrow(false);
          console.log("scrolling symbol false");
        } else {
          setShouldShowArrow(true);
          console.log("scrolling symbol true");
        }
        

        if (contentElement && arrowElement) {
          const scrollTop = contentElement.scrollTop;
          const maxScrollTop = contentElement.scrollHeight - contentElement.clientHeight;
          const scrollPercentage = (scrollTop / (maxScrollTop)) * 100;  //check whether add 100 or not
          arrowElement.style.top = `${10+scrollPercentage}%`;
        }
      };
    
    
    const componentStyles = {
        padding: '10px 15px',
        ...sx,
        width: width? width : 'inherit',
        height: height? height : '0px',
        borderRadius : borderRadius? borderRadius : 'none',
        backgroundColor : backgroundColor? backgroundColor : 'inherite',
        color: color? color : 'color',
        overflowX:'hidden',
        overflowY:'auto',
        position:'relative',
        // paddingBottom:'5%',
     };

    return (
    <div 
      onScroll={handleScroll}
      ref={contentRef} 
      className='ScrollableDiv' 
      style={componentStyles}>

      {shouldShowArrow && (
        <div 
          ref={arrowRef}
          style={{ textAlign: 'center',position:'absolute',top:'10%',left:'97%',animationPlayState: 'running' }}
          className="scroll-indicator"
        >
          <span style={{fontSize:'40px',color:'gray'}}>&#x27A7;</span>
        </div>
      )}

      {children}
      
      {/* {shouldShowArrow && (
        <div style={{ textAlign: 'center',position:'absolute',top:'90%',left:'50%' }}>
          <span style={{fontSize:'40px',color:'blue'}}>&#x21e9;</span>
        </div>
      )} */}
    </div>
  )
}

export default ScrollableDiv
