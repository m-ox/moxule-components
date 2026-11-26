import { useState } from "react";
import { FileUpload, Text, TextArea } from "../../../../index";

export function WritingFieldsExample() {
  const [files, setFiles] = useState<File[]>([]);
  return <>
    <TextArea label="Summary" name="summaryExample" placeholder="A few words about your story…" description="A plain-text example, independent of the Markdown draft." />
    <FileUpload label="Attachments" name="attachments" multiple accept="image/*,.pdf,.txt,.md" onFilesChange={setFiles}
      description="Choose images or documents to try the picker. This example keeps files on your device." />
    {files.length ? <Text variant="sm" role="status">Selected: {files.map((file) => file.name).join(", ")}</Text> : null}
  </>;
}
