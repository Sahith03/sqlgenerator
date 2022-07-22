import React, { useState, useRef, useEffect,useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Handle,
    Controls
} from 'react-flow-renderer';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CustomEdge from './customedge';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import UseGenerateRandomColor from './GenerateColor';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import Generatesql from './Generatesql';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const sourceNode = ({ data }) => {
    console.log(data)
    if(data.color===""){
        data.color="FFA500"
    }
    return (
        <>

            <Box sx={{ border: 2, borderColor: "#" + data.color, borderRadius: 2 }}>
                <Card variant="outlined" sx={{ maxWidth: 500, minHeight: 300, minWidth: 260 }}>
                    <CardHeader style={{ backgroundColor: "#" + data.color, border: 1, borderColor: "#" + data.color, borderRadius: 2 }} title={data.label} />
                    <React.Fragment>
                        <CardContent>
  
                            <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
                                {data.value}
                            </Typography>

                        </CardContent>

                    </React.Fragment>
                </Card>
            </Box>

        </>
    )
}
const colNode = ({ data }) => {
    console.log(data)

    return (
        <>
            <Handle
                id="b"
                type="target"
                position="left"
                onConnect={(params) => console.log('handle onConnect', params)}
                style={{ backgroundColor: 'warning.main' }}
                isConnectable={true}
            />
            <Card variant="outlined" sx={{ maxWidth: 240, maxHeight: 50 }}>

                <React.Fragment>
                    <CardContent  >

                        {data.label} | {data.value} | {data.key} | {data.n}

                    </CardContent>

                </React.Fragment>
            </Card>
            <Handle
                type="source"
                position="right"
                id="a"
                style={{ backgroundColor: 'warning.main' }}
                isConnectable={true}
            />

        </>
    );
}

/* let id = 0;
const getId = () => `dndnode_${id++}`; */
const nodeTypes = { source: sourceNode, col: colNode };
const edgeTypes = { custom: CustomEdge };
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
let nodeId = 0;

const Datablock = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [, setReactFlowInstance] = useState(null);
    const [objectEdit, setObjectEdit] = useState({});
    const { color, generateColor } = UseGenerateRandomColor();
    const [colId, setColId] = useState([]);
    const [,setPos] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [structuredData, setStructuredData] = useState([]);
    const [projectName, setProjectName] = useState("");

    const onDoubleClickOfNode = (node) => {
         console.log("node", node) 
        setObjectEdit(node)

    }

    const onPaneClick = () => {
        setObjectEdit({});
    };

    const onConnect = (params) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true }, eds));

    useEffect(() => {
        if (edges.length !== 0) {
            setDatastructure(edges, nodes)
        }
    }, [edges, nodes]);

    const setDatastructure = (edges, nodes) => {
        console.log("Edges: ", edges)
        console.log("Nodes: ", nodes)
        let objList = {}
        for (let node of nodes) {
            let struct = {
                id: node.id,
                name: node.data.name,
                type: node.data.label,
                sources: [],
                targets: []
            }
            objList[node.id] = struct
        }
        console.log("Object List: ", objList)
        let struct = []
        for (let edge of edges) {
            objList[edge.source].targets.push(objList[edge.target].name)
            objList[edge.target].sources.push(objList[edge.source].name)

            struct[edge.source] = objList[edge.source]
            struct[edge.target] = objList[edge.target]
        }
        let arr = []
        for (let key in struct) {
            arr.push(struct[key])
        }
        console.log("The Structure is:", arr)
        setStructuredData(struct)
    }

    const generateProject = () => {
        console.log("seeing this",nodes)
        let resultCode = Generatesql(nodes,edges)
        let zip = new JSZip();
        zip.file(projectName + ".sql", resultCode)
        downloadZip(projectName, zip)
    }
    const downloadZip = (name, zip) => {
        return zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, name + ".zip");
        });
    };

    const addINode = useCallback(() => {
        reactFlowWrapper.current += 50;
        generateColor()
        const position = {
            x: 250 ,
            y: 10 ,
        };
        setPos(position)
        setNodes((nodes) => {
            console.log(nodes);
            const id = `${++nodeId}`;
            return [
                ...nodes,
                {
                    id,
                    type: "source",
                    data: { label: "Table ", value: "", color: `${color}` },
                    position,
                }
            ];
        });
    }, [color, generateColor, setNodes]);

    console.log("object2:  ", colId)
    const addColid = () => {

        setColId(objectEdit.id)
        addCol(colId)
        
    }
    useEffect(() => {
        if (colId !== []) {

            console.log("object 3: ",colId)
            
        }
    }, [colId]);
    
    const addCol = useCallback( async (event) => {
        reactFlowWrapper.current += 50;
        const position = {
            x: 20 ,
            y: 50,
        };
        console.log("object1:  ",colId)

        setNodes((nodes) => {
            console.log(nodes);
            const id = `${++nodeId}`;
            
            const parentNode = `${colId}`
            return [
                ...nodes,
                {
                    id,
                    type: "col",
                    data: { label: "id", value: "int" ,key:"primary",n:"not null",pNode:`${colId}`},
                    position,
                    parentNode,
                    extent: 'parent',
                    // expandParent: true,
                }
            ];
        });
    }, [colId, setNodes]);

/*     const change=(e) => {
        setObjectEdit({
            ...objectEdit,
            data: { ...objectEdit.data, value: e.target.value }
        });

        const newElement = nodes.map((item) => {
            if (item.id === objectEdit.id) {
                return {
                    ...item,
                    data: { ...item.data, key: e.target.value }
                };
            }
            return item;
        });

        setNodes(newElement);
    } */

    return (
        <Box sx={{ flexGrow: 1 }}>
            <div className="dndflow" >
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Button variant="outlined" style={{marginTop:"10px" }} onClick={addINode}>Add Table</Button>
                        <div style={{margin:"10px" }}>
                    <TextField id="outlined-basic" label="Project Name" value={projectName} onChange={(e) => { setProjectName(e.target.value) }} variant="outlined" />
                </div>
                        <Button variant="contained" style={{marginBottom:"10px" }} onClick={generateProject}>Generate Script</Button>
                        <div style={{ textAlign: "left", padding: 10 }}>

                            {console.log("object:", objectEdit.id)}
                            {
                                objectEdit.type === 'source' && (
                                    <>

{"Table name :  "}
                                        <Input defaultValue="Table"
                                            value={objectEdit.data.value}
                                            onChange={(e) => {
                                                setObjectEdit({
                                                    ...objectEdit,
                                                    data: { ...objectEdit.data, value: e.target.value }
                                                });

                                                const newElement = nodes.map((item) => {
                                                    if (item.id === objectEdit.id) {
                                                        return {
                                                            ...item,
                                                            data: { ...item.data, label: e.target.value }
                                                        };
                                                    }
                                                    return item;
                                                });

                                                setNodes(newElement);
                                            }}
                                        />
                                        {" "}
                                        <Button style={{margin:"10px" }} variant="outlined" onClick={addColid}>Add Column</Button>
                                    </>
                                )}
                            {console.log("object:", objectEdit.id)}
                            {
                                objectEdit.type === 'col' && (
                                    <>
                                        
                                        
                                        
                                        {"Attribute: "}
                                        <input height="100"
                                            value={objectEdit.data.label}
                                            onChange={(e) => {
                                                setObjectEdit({
                                                    ...objectEdit,
                                                    data: { ...objectEdit.data, label: e.target.value }
                                                });

                                                const newElement = nodes.map((item) => {
                                                    if (item.id === objectEdit.id) {
                                                        return {
                                                            ...item,
                                                            data: { ...item.data, label: e.target.value }
                                                        };
                                                    }
                                                    return item;
                                                });

                                                setNodes(newElement);
                                            }}
                                        />
                                        <br></br>{"Data type: "}
                                            <Select
                                                style={{margin:"10px" }}
                                                value={objectEdit.data.value}
                                                label="datatype"
                                                onChange={(e) => {
                                                    setObjectEdit({
                                                        ...objectEdit,
                                                        data: { ...objectEdit.data, value: e.target.value }
                                                    });

                                                    const newElement = nodes.map((item) => {
                                                        if (item.id === objectEdit.id) {
                                                            return {
                                                                ...item,
                                                                data: { ...item.data, value: e.target.value }
                                                            };
                                                        }
                                                        return item;
                                                    });

                                                    setNodes(newElement);
                                                }}
                                            >
                                                <MenuItem value={'binary'}>binary</MenuItem>
                                                <MenuItem value={'blob'}>blob</MenuItem>
                                                <MenuItem value={'boolean'}>boolean</MenuItem>
                                                <MenuItem value={'char'}>char</MenuItem>
                                                
                                                <MenuItem value={'double'}>double</MenuItem>
                                                <MenuItem value={'enum'}>enum</MenuItem>
                                                <MenuItem value={'float'}>float</MenuItem>
                                                
                                                <MenuItem value={'int'}>int</MenuItem>
                                                
                                                <MenuItem value={'text'}>text</MenuItem>
                                                
                                                
                                                <MenuItem value={'varchar'}>varchar</MenuItem>

                                            </Select>
                                            <br></br>{"Key: "}
                                            <Select
                                                
                                                value={objectEdit.data.key}
                                                label="Key"
                                                onChange={(e) => {
                                                    setObjectEdit({
                                                        ...objectEdit,
                                                        data: { ...objectEdit.data, key: e.target.value }
                                                    });

                                                    const newElement = nodes.map((item) => {
                                                        if (item.id === objectEdit.id) {
                                                            return {
                                                                ...item,
                                                                data: { ...item.data, key: e.target.value }
                                                            };
                                                        }
                                                        return item;
                                                    });

                                                    setNodes(newElement);
                                                }}
                                            >
                                                <MenuItem value={'primary'}>primary</MenuItem>
                                                <MenuItem value={'unique'}>unique</MenuItem>
                                                
                                                <MenuItem value={' '}>none</MenuItem>
                                            </Select>
                                            <br></br>{" Null: "}
                                            <Select
                                                style={{margin:"10px" }}
                                                value={objectEdit.data.n}
                                                onChange={(e) => {
                                                    setObjectEdit({
                                                        ...objectEdit,
                                                        data: { ...objectEdit.data, n: e.target.value }
                                                    });

                                                    const newElement = nodes.map((item) => {
                                                        if (item.id === objectEdit.id) {
                                                            return {
                                                                ...item,
                                                                data: { ...item.data, n: e.target.value }
                                                            };
                                                        }
                                                        return item;
                                                    });

                                                    setNodes(newElement);
                                                }}
                                            >
                                                <MenuItem value={'null'}>null</MenuItem>
                                                <MenuItem value={'not null'}>not null</MenuItem>
                                                
                                            </Select>
                                        
                                    </>
                                )}
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <Item>
                            <ReactFlowProvider>
                                <div className="reactflow-wrapper" style={{ width: "100%", height: "85vh" }} ref={reactFlowWrapper}>
                                    <ReactFlow
                                        nodes={nodes}
                                        edges={edges}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        onInit={setReactFlowInstance}

                                        onNodeDoubleClick={(event, node) => onDoubleClickOfNode(node)}

                                        onPaneClick={onPaneClick}
                                        nodeTypes={nodeTypes}
                                        edgeTypes={edgeTypes}
                                        fitView
                                    >
                                        <Controls />
                                        
                                    </ReactFlow>
                                </div>

                            </ReactFlowProvider>

                        </Item>
                    </Grid>

                </Grid>
            </div>
        </Box>

    );
};

export default Datablock;