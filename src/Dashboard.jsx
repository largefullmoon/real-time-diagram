import React, { useState, useCallback, useEffect } from 'react';
import {
    ReactFlowProvider,
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    MiniMap,
    Background,
    Handle,
    useReactFlow,
    Position,
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Edit from './assets/edit.svg'
import Delete from './assets/delete.svg'
import LogOut from './assets/logout.svg'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useNavigate } from 'react-router-dom';
import { data } from 'autoprefixer';
import axios from 'axios';
import { toast } from 'react-toastify';
const initialNodes = [
];
const initialEdges = [];
export const NormalNode = ({ data, onDragStart }) => {
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);
    const [html, setHtml] = useState("")
    useEffect(() => {
        if (data.queue) {
            let consumersString = ""
            data.queue.consumers.map((consumer, index) => {
                if (index == 0) {
                    consumersString += `<p>
                        consumers:
                    </p>`
                }
                consumersString += `<p class="pl-5">
                        channelName : ${consumer?.channelName}
                    </p>
                    <p class="pl-5">
                        consumerTag : ${consumer?.consumerTag}
                    </p>
                    <p class="pl-5">
                        isActive : ${consumer?.isActive}
                    </p>`
            })
            setHtml(consumersString)
        }
    }, [html])
    return (
        <a data-tooltip-id="my-tooltip" data-tooltip-html={
            data.exchange ?
                `<div class='flex flex-col items-start justify-start flex-1 w-full h-fit'>
                <p>
                    name : ${data.exchange.exchangeName}
                </p>
                <p>
                    type : ${data.exchange.exchangeType}
                </p>
                <p>
                    isDurable : ${data.exchange.isDurable ? "true" : "false"}
                </p>
                <p>
                    guid : ${data.exchange.guid}
                </p>
            </div>` : data.queue && `
            <div class='flex flex-col items-start justify-start flex-1 w-full h-fit'>
                <p>
                    name : ${data.queue.queueName}
                </p>
                <p>
                    isDurable : ${data.queue.isDurable ? "true" : "false"}
                </p>
                <p>
                    guid : ${data.queue.guid}
                </p>
                ${html}
            </div>
            `
        }
            onDragStart={onDragStart}
            onContextMenu={(e) => {
                e.preventDefault();
                setIsToolbarOpen(!isToolbarOpen)
            }}
            style={{
                backgroundColor: data.color,
                width: 150,
                height: 'fit-content ',
                minHeight: '45px',
                borderRadius: '8px',
                display: 'flex',
                color: 'white',
                fontSize: '12px',
                textAlign: 'center',
                border: '1px solid #3F3F46'
            }}
            draggable={data.draggable}
            className={`flex items-center justify-center flex-col`}
        >
            <div className={`${data.exchange ? "rounded-lg flex items-center justify-center flex-1 w-full border border-white h-8" : "rounded-lg"}`}>
                {!data.draggable && data.label}
            </div>
            {

                <>
                    <Tooltip id="my-tooltip" />
                    <div>
                        <Handle
                            type="target"
                            position={Position.Left}
                            style={{ background: '#555', width: 5, height: 5 }} // Right side for outgoing connections
                        />
                        <Handle
                            type="source"
                            position={Position.Right}
                            style={{ background: '#555', width: 5, height: 5 }} // Right side for outgoing connections
                        />
                    </div>
                </>

            }
        </a >
    );
};
const nodeTypes = {
    normal: NormalNode,
};
const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
    markerEnd,
}) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 16,
                        pointerEvents: 'all',
                    }}
                    className="flex items-center justify-center nodrag nopan"
                >
                    {data.count}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
const edgeTypes = {
    buttonedge: CustomEdge,
};
const Dashboard = () => {
    const [json, setJson] = useState({})
    const navigate = useNavigate();
    if (!localStorage.getItem("isSigned")) {
        navigate("/signin")
    }
    const getJson = async () => {
        const token = await localStorage.getItem('token')
        console.log(token, "token")
        try {
            const response = await axios.get('/api/api/rabbitmq/get-merged-lists/1', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data)
            setJson(response.data)
            toast.dismiss();
        } catch (error) {
            toast.dismiss();
            toast.error("Something went wrong, Can't get data from the api")
        }
    }
    useEffect(() => {
        if (json != {}) {
            let elements = [];
            let links = []
            if (json?.attachedExchanges) {
                json.attachedExchanges.forEach((attachExchange) => {
                    if (attachExchange?.exchange) {
                        elements.push({
                            id: `exchange_${attachExchange.exchange?.guid ? attachExchange.exchange.guid : attachExchange.exchange.exchangeName}`,
                            position: { x: 0, y: elements.length * 50 },
                            data: { label: attachExchange.exchange.exchangeName, color: "blue", exchange: attachExchange.exchange },
                            type: 'normal'
                        });
                        if (attachExchange.queues) {
                            attachExchange.queues.forEach((queue, index) => {
                                elements.push({
                                    id: `queue_${queue?.guid ? queue.guid : queue.queueName}`, // Using GUID as unique id  
                                    position: { x: 400, y: elements.length * 50 }, // Random x-position to avoid overlap  
                                    data: { label: queue.queueName, color: "purple", queue: queue },
                                    type: 'normal'
                                });
                                links.push({ id: `link_queue_${queue?.guid ? queue.guid : queue.queueName}`, source: `exchange_${attachExchange.exchange?.guid ? attachExchange.exchange.guid : attachExchange.exchange.exchangeName}`, target: `queue_${queue?.guid ? queue.guid : queue.queueName}`, type: "buttonedge", data: { count: queue.messageCount, name: queue.queueName } })
                            });
                        }
                    }
                });
            }
            if (json?.unAttachedExchanges) {
                json.unAttachedExchanges.forEach((unattachExchange) => {
                    if (unattachExchange?.exchange) {
                        elements.push({
                            id: `unattached_exchange_${unattachExchange.exchange?.guid ? unattachExchange.exchange.guid : unattachExchange.exchange.exchangeName}`,
                            position: { x: 0, y: elements.length * 50 },
                            data: { label: unattachExchange.exchange.exchangeName, color: "blue", exchange: unattachExchange.exchange },
                            type: 'normal'
                        });
                    }
                });
            }
            setNodes(elements);
            setEdges(links);
        }
    }, [json]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: "buttonedge" }, eds)),
        [setEdges],
    );
    useEffect(() => {
        if (edges.length > 0 && nodes.length > 0)
            getSocketData()
    }, [edges, nodes])
    const getSocketData = async () => {
        const socket = new WebSocket('ws://app.sundru.net/ws');
        socket.onopen = function () {
            console.log('WebSocket connection established.');

            // Construct the STOMP CONNECT frame
            const connectFrame = 'CONNECT\n' +
                'accept-version:1.2,1.1\n' +
                'heart-beat:0,0\n\n' + // Heartbeat setting
                '\0'; // Null byte to terminate the frame

            // Send the CONNECT frame
            socket.send(connectFrame);
            console.log('CONNECT frame sent.');

            // After connection is established, send a STOMP SEND frame
            const messageBody = {
                "command": "SEND",
                "destination": "/app/realtime-info",
                "body": {
                    "vhost": null,  // Replace with your vhost if necessary
                    "queueNames": ["demoQueue_dlq"]  // Replace with the queue names you want
                }
            };

            // Convert the body to a JSON string
            const bodyJson = JSON.stringify(messageBody.body);

            // Construct the STOMP SEND frame
            const sendFrame = 'SEND\n' +
                'destination:/app/realtime-info\n' +
                'content-type:application/json\n\n' +  // Content-Type header
                bodyJson + '\0'; // Null byte to terminate the frame

            // Send the SEND frame
            socket.send(sendFrame);
            console.log('SEND frame sent: ' + bodyJson);

            // Subscribe to the /topic/realtime-response
            const subscribeFrame = 'SUBSCRIBE\n' +
                'destination:/topic/realtime-response\n' +
                'id:sub-001\n\n' + // Add a unique subscription ID
                '\0'; // Null byte to terminate the frame
            socket.send(subscribeFrame);
            console.log('Subscribed to /topic/realtime-response.');
        };
        socket.onmessage = function (event) {
            // Parse the server response (assuming it’s a JSON response)
            try {
                const response = event.data;
                if (Array.isArray(response)) {
                    // Display each QueueDto object in the response
                    response.forEach(queueDto => {
                        setEdges(edges.map((edge) => {
                            if (edge.data.name === queueDto.queueName) {
                                return { ...edge, data: { ...edge.data, count: queueDto.messageCount } };
                            } else {
                                return edge
                            }
                        }));
                    });
                } else {
                    console.log('Unexpected response format.');
                }
            } catch (error) {
                console.log('Error parsing response: ' + event.data);
            }
        };
    }
    useEffect(() => {
        setTimeout(async () => {
            toast.dismiss();
            toast.info('Loading data...', {
                autoClose: false, // Keep the toast open until we close it
                position: 'bottom-center'
            });
            await getJson()
        }, 1);
    }, [])
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div className='absolute top-0 right-0 z-10 flex flex-col items-center cursor-pointer w-fit h-fit hover:bg-blue-300' onClick={() => {
                localStorage.removeItem('isSigned')
                navigate("/")
            }}>
                <LogOut className="w-8 h-8" />
                Log Out
            </div>
            <ReactFlowProvider >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    fitViewOptions={{

                        padding: 0.2,
                    }}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default Dashboard;