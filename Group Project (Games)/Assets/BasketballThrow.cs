using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BasketballThrow : MonoBehaviour
{
	public GameObject leftHand;
	public GameObject rightHand;

	// Start is called before the first frame update
	void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 leftHandVelocity = leftHand.GetComponent<ControllerVelocity>().controllerVelocity;
        Vector3 rightHandVelocity = rightHand.GetComponent<ControllerVelocity>().controllerVelocity;

        if (leftHandVelocity.magnitude > 20.0f) {
            GetComponent<Rigidbody>().AddForce(leftHandVelocity);
        } else if (rightHandVelocity.magnitude > 20.0f) {
            GetComponent<Rigidbody>().AddForce(rightHandVelocity);
        }
    }
}
