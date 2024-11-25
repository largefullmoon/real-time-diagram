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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Edit from './assets/edit.svg'
import Delete from './assets/delete.svg'
import LogOut from './assets/logout.svg'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useNavigate } from 'react-router-dom';
const initialNodes = [
];
const initialEdges = [];
export const NormalNode = ({ data, onDragStart }) => {
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);
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
                    messageCount : ${data.queue.messageCount}
                </p>
                <p>
                    isDurable : ${data.queue.isDurable ? "true" : "false"}
                </p>
                <p>
                    guid : ${data.queue.guid}
                </p>
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
const Dashboard = () => {
    const navigate = useNavigate();
    if (!localStorage.getItem('isSigned')) {
        navigate('/signin')
    }
    const [json, setJson] = useState({
        "attachedExchanges": [
            {
                "exchangeName": "demo_sj_exchange",
                "queues": [
                    {
                        "queueName": "demoQueue",
                        "consumers": [
                            {
                                "channelName": "127.0.0.1:49346 -> 127.0.0.1:5672 (1)",
                                "consumerTag": "rabbitmq-experiment-service",
                                "isActive": true
                            }
                        ],
                        "isDurable": true,
                        "messageCount": 0,
                        "bindings": null,
                        "guid": "e76049db-83bf-4cff-b282-b4fa36a0fa1e"
                    },
                    {
                        "queueName": "demoQueue1",
                        "consumers": [],
                        "isDurable": true,
                        "messageCount": 0,
                        "bindings": null,
                        "guid": "821d52e5-c9c8-4223-a6c1-7687d818fbc5"
                    }
                ],
                "exchange": {
                    "exchangeName": "demo_sj_exchange",
                    "exchangeType": "direct",
                    "isDurable": true,
                    "guid": "0628c3c2-c40a-436a-ab9d-9405e693be60"
                },
                "bindings": [
                    {
                        "exchangeName": "demo_sj_exchange",
                        "routingKey": "demo_sj_routing_key"
                    },
                    {
                        "exchangeName": "demo_sj_exchange",
                        "routingKey": "demo_sj_routing_key"
                    }
                ],
                "empty": false
            },
            {
                "exchangeName": "demo_sj_exchange_dlx",
                "queues": [
                    {
                        "queueName": "demoQueue_dlq",
                        "consumers": [],
                        "isDurable": true,
                        "messageCount": 0,
                        "bindings": null,
                        "guid": "6867ea89-2d57-4b2b-963a-acc0922c2f66"
                    }
                ],
                "exchange": {
                    "exchangeName": "demo_sj_exchange_dlx",
                    "exchangeType": "direct",
                    "isDurable": true,
                    "guid": "f2c51c48-3be9-48c5-8207-c3129dfaa78b"
                },
                "bindings": [
                    {
                        "exchangeName": "demo_sj_exchange_dlx",
                        "routingKey": "demo_sj_routing_key_dlq"
                    }
                ],
                "empty": false
            }
        ],
        "unAttachedExchanges": [
            {
                "exchangeName": "amq.direct",
                "queues": null,
                "exchange": {
                    "exchangeName": "amq.direct",
                    "exchangeType": "direct",
                    "isDurable": true,
                    "guid": "5321749c-3698-46e2-a518-3dc0c834b8ab"
                },
                "bindings": null,
                "empty": false
            },
            {
                "exchangeName": "amq.fanout",
                "queues": null,
                "exchange": {
                    "exchangeName": "amq.fanout",
                    "exchangeType": "fanout",
                    "isDurable": true,
                    "guid": "503da384-538a-4769-9973-021d33d27201"
                },
                "bindings": null,
                "empty": false
            },
            {
                "exchangeName": "amq.headers",
                "queues": null,
                "exchange": {
                    "exchangeName": "amq.headers",
                    "exchangeType": "headers",
                    "isDurable": true,
                    "guid": "41ebab4d-80b3-457e-aef4-dca6554900b6"
                },
                "bindings": null,
                "empty": false
            },
            {
                "exchangeName": "amq.match",
                "queues": null,
                "exchange": {
                    "exchangeName": "amq.match",
                    "exchangeType": "headers",
                    "isDurable": true,
                    "guid": "6916db2f-4b9d-416a-a4a3-bbc7b8c04b64"
                },
                "bindings": null,
                "empty": false
            },
            {
                "exchangeName": "amq.rabbitmq.trace",
                "queues": null,
                "exchange": {
                    "exchangeName": "amq.rabbitmq.trace",
                    "exchangeType": "topic",
                    "isDurable": true,
                    "guid": "5b8af142-e49d-4d65-9355-38837c454db6"
                },
                "bindings": null,
                "empty": false
            },
            {
                "exchangeName": "amq.topic",
                "queues": null,
                "exchange": {
                    "exchangeName": "amq.topic",
                    "exchangeType": "topic",
                    "isDurable": true,
                    "guid": "31754845-d932-476c-9be9-fda336be36a3"
                },
                "bindings": null,
                "empty": false
            }
        ]
    })
    useEffect(() => {
        let elements = [];
        let links = []
        json.attachedExchanges.forEach((attachExchange) => {
            elements.push({
                id: `exchange_${attachExchange.exchange.guid}`,
                position: { x: 0, y: elements.length * 50 },
                data: { label: attachExchange.exchange.exchangeName, color: "blue", exchange: attachExchange.exchange },
                type: 'normal'
            });
            if (attachExchange.queues) {
                attachExchange.queues.forEach((queue, index) => {
                    elements.push({
                        id: `queue_${queue.guid}`, // Using GUID as unique id  
                        position: { x: 400, y: elements.length * 50 }, // Random x-position to avoid overlap  
                        data: { label: queue.queueName, color: "purple", queue: queue },
                        type: 'normal'
                    });
                    links.push({ id: `link_queue_${queue.guid}`, source: `exchange_${attachExchange.exchange.guid}`, target: `queue_${queue.guid}` })
                });
            }
        });

        json.unAttachedExchanges.forEach((unattachExchange) => {
            elements.push({
                id: `unattached_exchange_${unattachExchange.exchange.guid}`,
                position: { x: 0, y: elements.length * 50 },
                data: { label: unattachExchange.exchange.exchangeName, color: "blue", exchange: unattachExchange.exchange },
                type: 'normal'
            });
        });

        setNodes(elements);
        setEdges(links);
    }, [json]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
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
                    // colorMode={'dark'}
                    fitView
                    fitViewOptions={{
                        
                        padding: 0.2,
                    }}
                    nodeTypes={nodeTypes}
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