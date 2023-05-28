import { useSetRecoilState } from 'recoil'
import { ReactComponent as SettingsIconSVG } from '../assets/settings.svg'
import styled from 'styled-components'
import { settingsOpenState } from '../states/settings'

export const SettingsIcon = () => {
  const setter = useSetRecoilState(settingsOpenState)

  return <Icon width={20} height={20} onClick={() => setter(true)} />
}

const Icon = styled(SettingsIconSVG)`
  cursor: pointer;
`
