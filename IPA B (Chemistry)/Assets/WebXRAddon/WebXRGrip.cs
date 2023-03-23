using Zinnia.Action;
using WebXR;

public class WebXRGrip : BooleanAction
{
  public WebXRController controller;
  // Update is called once per frame
  void Update()
  {
    Receive(controller.GetButton(WebXRController.ButtonTypes.Grip));
  }
}
