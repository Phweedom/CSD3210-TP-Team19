using Zinnia.Action;
using WebXR;

public class WebXRThumb : BooleanAction
{
  public WebXRController controller;

  // Update is called once per frame
  void Update()
  {
    Receive(controller.GetButton(WebXRController.ButtonTypes.Thumbstick));
  }
}
