import { TextInput } from "../../../../index";

export function TitleInputExample() {
  return <TextInput label="Title" name="titleExample" defaultValue="A little story" placeholder="Give your story a title"
          description="A standalone title example. This field isn't saved with the Markdown below." />;
}
