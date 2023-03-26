/**
 * Allows basketballs to get the controllers' velocity values.
 */
using WebXR;
using UnityEngine;

public class ControllerVelocity : MonoBehaviour
{
    public WebXRController controller;

    private Vector3 previousPosition;
    private Vector3 currentPosition;
    public Vector3 controllerVelocity;

	// Update is called once per frame
	void Update()
  {
        currentPosition = controller.transform.position;

        // Calculate the position delta between the current and previous frames
        Vector3 positionDelta = currentPosition - previousPosition;

        // Calculate the velocity based on the position delta and the time between frames
        float deltaTime = Time.deltaTime;
        controllerVelocity = positionDelta / deltaTime;

        //print(gameObject.name + " velocity: " + controllerVelocity);

        // Store the current position as the previous position for the next frame
        previousPosition = currentPosition;     
    }
}
