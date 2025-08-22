import { type SchemaTypeDefinition } from 'sanity'
import user from './user'
import restaurant from './restaurant'
import passwordResetToken from './passwordResetToken'
import menu from './menu'
import dish from './dish'
import view from './view'
import stat from './stat'
import category from './category'
import { qrCodeSettings } from './qrCodeSettings'



export const schema: { types: SchemaTypeDefinition[] } = {
  types:[user, restaurant,category,  menu, dish, stat, view,passwordResetToken, qrCodeSettings],
}
