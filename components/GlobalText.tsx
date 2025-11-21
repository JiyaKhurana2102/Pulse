// components/GlobalText.tsx
import { Text, TextProps } from 'react-native';

// Define the custom font family name used when loading the font in _layout.tsx
const CUSTOM_FONT = 'Lora';

/**
 * Custom Text component that applies the Lora font family.
 * @param props The props for the Text component.
 */
export default function GlobalText(props: TextProps) {
  // Merge the default Lora font style with any styles passed via props.
  return (
    <Text
      {...props}
      style={[
        { fontFamily: CUSTOM_FONT },
        props.style
      ]}
    />
  );
}