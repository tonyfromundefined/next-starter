import * as styledComponents from 'styled-components'
import { ThemedStyledComponentsModule } from 'styled-components'
import { Theme } from './themes/base'

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as ThemedStyledComponentsModule<Theme>

export { css, createGlobalStyle, keyframes, ThemeProvider }
export default styled
