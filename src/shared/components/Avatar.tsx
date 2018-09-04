import * as React from 'react'

type AvatarSize = 'default' | 'large' | 'xLarge'

type AvatarProps = {
  photoURL: string
  size: AvatarSize
}

const sizes = new Map<AvatarSize, string>([
  ['default', '36px'],
  ['large', '60px'],
  ['xLarge', '96px'],
])

export const Avatar: React.SFC<AvatarProps> = props => (
  <img
    src={props.photoURL}
    style={{
      height: sizes.get(props.size),
      width: sizes.get(props.size),
      borderRadius: '50%',
    }}
  />
)
