import React from 'react';
import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';
import './index.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//import { alignProperty } from '@mui/material/styles/cssUtils';

const foreignObjectSize = 90;

/* const onEdgeClick = (evt, id) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
}; */

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const [relation, setRelation] = React.useState('');

  const handleChange = (event) => {
    setRelation(event.target.value);
  };
  
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
          animated
        />
        <foreignObject
          width={200}
          height={150}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          
          <FormControl sx={{ minWidth: 150 ,minHeight:40}}>
          <InputLabel id="demo-simple-select-autowidth-label">Relationship</InputLabel>
          <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={relation}
          onChange={handleChange}
          label="Relationship"
          autoWidth
        >
          <MenuItem value={'One-One'}>One-One</MenuItem>
          <MenuItem value={'One-Many'}>One-Many</MenuItem>
          <MenuItem value={'Many-One'}> Many-One</MenuItem>

        </Select>
        <FormHelperText>Relationship</FormHelperText>
        </FormControl>
          
          
        </foreignObject>
      </>
    );
  }