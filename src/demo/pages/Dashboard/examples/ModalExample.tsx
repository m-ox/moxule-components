import { useState } from "react";
import { Button, Card, Header, Modal, Text } from "../../../../index";

export function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mx-demo-card" aria-labelledby="modal-demo-title">
      <Header id="modal-demo-title" variant="h3" className="mx-demo-control-title">Modal</Header>
      <Text variant="sm">A focused space for confirmations and extra details.</Text>
      <Button className="mx-demo-spaced" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        title="A little moment"
        description="Keep the important details in view."
        open={open}
        onOpenChange={setOpen}
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Not now</Button>
          <Button onClick={() => setOpen(false)}>Continue</Button>
        </>}
      >
        <Text>Add a confirmation, a short form, or a little more context here.</Text>
      </Modal>
    </Card>
  );
}
