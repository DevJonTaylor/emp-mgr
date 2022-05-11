type ScreenEventHandler = (application: Application) => void


declare class  Menu {
  name: string
  message: string

}

declare class Scene {
  constructor()
}


declare class Screen {
  constructor()

  clear(): this

  log(): this

  getQuestionFactory(): QuestionFactory

}

