export class Command<Arguments = {}, IsSubcommand extends boolean = false> {
  constructor(
    public readonly isSubcommand: IsSubcommand = false as IsSubcommand
  ) {}

  protected addOption<
    Type extends Options.Type,
    InputOption extends Option<Type>
  >(
    NewOption: { new (type: Type): InputOption & unknown },
    type: Type,
    input: BuilderInput<InputOption>
  ) {
    const option = input instanceof Option ? input : input(new NewOption(type));

    this.options[
      (option as unknown as DataOption | OptionWithChoices).required
        ? "unshift"
        : "push"
    ](option);

    return option;
  }
}
