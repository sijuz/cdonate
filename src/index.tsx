import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { WebviewType, AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui'

import { App } from './App'

const el = document.createElement('div')
document.body.appendChild(el)

const ConfigProviderFix: any = ConfigProvider
const AdaptivityProviderFix: any = AdaptivityProvider

ReactDOM.render(
    <BrowserRouter
        basename='/'
    >

        <React.StrictMode>

            <ConfigProviderFix
                appearance={'dark'}
                webviewType={WebviewType.INTERNAL}
                platform="ios"
            >

                <AdaptivityProviderFix >
                    <App />
                </AdaptivityProviderFix>

            </ConfigProviderFix>
        </React.StrictMode>

    </BrowserRouter>,
    document.querySelector('#root')
)
