import { Banner, Header } from "../../../../index";

export function BannerExamples() {
  return (
    <div className="mx-demo-banner-examples" aria-labelledby="banner-demo-title">
      <Header id="banner-demo-title" variant="h3" className="mx-demo-theme-title">Banner</Header>
      <Banner role="note" variant="success" message="Your changes have been saved." />
      <Banner role="note" variant="warning" message="Please review your settings before continuing." />
      <Banner role="note" variant="error" message="Something went wrong. Please try again." />
      <Banner role="note" message="You can update these preferences at any time." />
      <Banner role="note" className="mx-demo-custom-banner" message="A custom accent with an optional close button." dismissible />
    </div>
  );
}
