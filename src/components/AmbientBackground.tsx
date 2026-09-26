export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="a-drift a-glow absolute -left-40 -top-40 size-[38rem] rounded-full bg-primary/30 blur-[120px]" />
      <div className="a-drift2 absolute -right-32 top-48 size-[34rem] rounded-full bg-teal/20 blur-[120px]" />
      <div className="a-drift3 absolute -bottom-40 left-1/3 size-[30rem] rounded-full bg-accent/20 blur-[130px]" />
      <div className="grid-veil absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
