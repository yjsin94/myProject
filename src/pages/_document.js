import * as React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance' // 서버사이드 렌더링 시 캐칭된 css 옵션을 이용할 수 있게 해준다.
import createEmotionCache from 'src/util/createEmotionCache' // css 옵션을 파싱해서 하나의 객체로 묶어주는 역할을 한다.

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='ko'>
        <Head>
          <link rel='shortcut icon' href='/static/favicon.ico' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
          <meta name='emotion-insertion-point' content='' />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache() // 캐치된 객체를 정의해주고,
  const { extractCriticalToChunks } = createEmotionServer(cache) // 서버사이드 랜더링 시 할당된 스타일 객체를 스타일 오브젝트 객체에 입혀줄 것이다.

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        }
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(
    (
      style // 스타일을 파싱해서 묶어주는 역할을 한다.
    ) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    )
  )
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}
