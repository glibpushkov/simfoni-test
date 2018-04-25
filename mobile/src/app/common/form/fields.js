import BaseFieldHOC from './BaseFieldHOC'
import { CodeInput } from './input'

import PhoneInput from './phoneInput'

const PhoneInputField = BaseFieldHOC(PhoneInput)
const CodeInputField = BaseFieldHOC(CodeInput)

export {
  PhoneInputField,
  CodeInputField
}
