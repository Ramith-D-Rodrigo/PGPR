import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';

const DiscriptiveDiv = ({children, ...otherProps}) => {
    //expand === 1 -> truncated | 2 -> expanded 
    let {onClick,expand,description,width,height,borderRadius,backgroundColor,color,sx} = otherProps;
    
    const componentStyles = {
        userSelect:expand==1? 'none' : 'inherit',
        overflowX:'hidden',
        overflowY:'auto',
        padding:'20px 30px',
        ...sx,
        width: width? width : 'inherit',
        height: height? height:'0px',
        borderRadius : borderRadius? borderRadius : '10px',
        backgroundColor : backgroundColor? backgroundColor : 'inherite',
        color: color? color : 'color',
        position:'relative',
        textAlign:'center',
     };
    
    return (
        <>
        <div style={{position:'relative',display:'flex',flexDirection:'row',justifyContent:'space-between',width:'100%',top:'0.75rem',zIndex:1000,padding:'0px 15px'}}>
            <div className="description" 
                    style={{
                        padding:'3px',width:'fit-content',textAlign:'center',userSelect:'none',
                        height:'1.5rem',borderRadius:'5px',backgroundColor:'#e6ffe6',display:'flex',alignItems:'center',justifyContent:'center',
                        color:'black',fontSize:'1rem',boxShadow:'0px 0px 2px 0px rgba(0,0,0,0.75)'
                    }}
                >
                    {description}
            </div>
            {
            (expand==1 || expand==2) && 
            <Button
            onClick={onClick}
                variant="outlined"
                style = {{
                    padding:'3px',border:'1px solid',width:'fit-content',textAlign:'center',
                    height:'1.5rem',borderRadius:'5px',backgroundColor:'white',color:'black'
                }}
            >{expand==1? 'Expand':'Truncate'}</Button>
            }
        </div>
        <div onClick={onClick} className='DiscriptiveDiv' style={componentStyles} >
            {expand==1 && 'Click here to view PGPR details'}
            {(expand==2 || expand == undefined) && children}
        </div>
        </>
    )
}

export default DiscriptiveDiv
