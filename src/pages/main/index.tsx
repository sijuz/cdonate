import {
    Button,
    Card,
    CardGrid,
    Div,
    FormItem,
    Group,
    Input,
    Panel, PanelHeader, Title
} from '@vkontakte/vkui'
import axios from 'axios'

import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { VldBuilder, vlds } from 'validatorus-react'

interface MainProps {
    id: string,
    setActiveModal: Function,
    consoleLog: Function,
    isDesktop: boolean,
    openPop: Function,
    closePop: Function
}
function getParameterByName (name: string, url = window.location.href) {
    const name1 = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp(`[?&]${name1}(=([^&#]*)|&|#|$)`)
    const results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function fixAmount (nanoAmount: number, type: boolean, nano?: number) {
    const amount = type && nano ? (nanoAmount / (10 ** nano)) : nanoAmount
    // console.log(amount)
    let stringAmount = Number(amount).toFixed(2)

    if (Number(stringAmount) === 0) {
        stringAmount = Number(amount).toFixed(4)
    }
    return stringAmount
}

const urlApp = 'https://cdonate-node.sijuz.com/'

export const Main: React.FC<MainProps> = (props: MainProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)
    const location = useLocation()
    const history = useNavigate()

    const amountBuilder = new VldBuilder()
        .with(vlds.VNumber, 1, 100000)
        .with(vlds.VLen, 1, 128)
        .withFname('Value')

    function openLink (url: string) {
        const link2 = document.createElement('a')
        link2.href = url
        link2.target = '_blank'
        link2.click()
    }

    async function createPay () {
        if (amountBuilder.iserr !== 'error') {
            axios.post(`${urlApp}create`, { amount: amountBuilder.value }).then((data) => {
                openLink(`https://test-payform.enotondefi.net/?uuid=${data.data.result.payment_id}`)
            })
        }
    }

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)

            amountBuilder.change('1')
        }
    }, [])

    return (
        <Panel id={props.id}>

            <PanelHeader separator={false} />

            <Group>
                <Div>
                    <Div>
                        <Title level="1" >
                        Donate for <a href="https://sijuz.t.me" target="_blank">@sijuz</a>
                        </Title>
                        <small >
                        Донат на еду разработчика Polus
                        </small>
                    </Div>

                    <CardGrid size="l" style={{ marginTop: 16 }}>
                        <Card>
                            <Div>
                                <FormItem top="Amount USD">
                                    <Input
                                        value={amountBuilder.value}
                                        placeholder="0"
                                        type="number"
                                        onChange={e => amountBuilder.change(e.target.value)}
                                        status={amountBuilder.iserr}
                                    />
                                </FormItem>
                                <Div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Button
                                        size='l'
                                        onClick={() => amountBuilder.change('10')}
                                        stretched
                                        mode="secondary"
                                    >
                                        10 USD
                                    </Button>
                                    <Button
                                        size='l'
                                        onClick={() => amountBuilder.change('20')}
                                        stretched
                                        style={{ marginLeft: '16px' }}
                                        mode="secondary"
                                    >
                                        20 USD
                                    </Button>
                                </Div>
                                <Div>
                                    <Button
                                        size='l'
                                        onClick={() => createPay()}
                                        stretched
                                        disabled={amountBuilder.iserr === 'error'}
                                    >
                                        Pay {amountBuilder.value} USD
                                    </Button>
                                </Div>
                            </Div>
                        </Card>
                    </CardGrid>
                </Div>
            </Group>
        </Panel>
    )
}
