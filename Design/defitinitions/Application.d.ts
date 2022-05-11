declare class Application {
  constructor()

  execute(): this

  /**
   * This method checks if this is the first time running the app.
   * @private
   */
  private stepOne(): void
  private stepTwo(): void
  private stepThree(): void
}